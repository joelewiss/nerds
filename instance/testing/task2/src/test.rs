#[allow(unused_imports)]
use crate::{LinkedList, LinkedListNode};

impl LinkedList {
    /// Put item onto the front of the linked list
    fn push_front(&mut self, item: i32) {
        // Take the value from head, construct new node with old head as next
        let next = self.head.take();
        self.head = Some(Box::new(LinkedListNode { val: item, next } ));
    }

    fn from_slice(s: &[i32]) -> Self {
        let mut l = Self::new();
        for val in s.iter().rev() {
            l.push_front(*val);
        }
        return l
    }

    /// Utility for testing so I can use vec comparison
    pub fn as_vec(&self) -> Vec<i32> {
        let mut ret = vec![];
        let mut node = &self.head;
        loop {
            match &node {
                None => return ret,
                Some(n) => {
                    ret.push(n.val);
                    node = &n.next;
                }
            }
        }
    }
}


pub fn run_tests() {
    let mut results = vec![];
    results.push(remove_empty_list_tests());
    results.push(remove_head_tests());
    results.push(remove_tail_tests());
    results.push(remove_mid_tests());
    results.push(remove_out_of_bounds_tests());

    println!();
    for result in results {
        println!("{result}");
    }
}


fn remove_empty_list_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING remove_empty_list_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::new();

    if l.remove(0).is_ok() {
        println!("Test 1 FAILED: [].remove(0)");
        println!("\tExpected error");
        println!("\t{:<12}{:?}", "Got:", l.as_vec());
        all_passed = false;
    }

    let mut l = LinkedList::new();
    if l.remove(1).is_ok() {
        println!("Test 2 FAILED: [].remove(1)]");
        println!("\tExpected error");
        println!("\t{:<12}{:?}", "Got:", l.as_vec());
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "insert_empty_list_tests: PASSED"
    } else {
        "insert_empty_list_tests: FAILED"
    }
}


fn remove_head_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING remove_head_tests TESTS "));
    let mut all_passed = true;


    let mut l = LinkedList::from_slice(&[3, 2, 1]);

    match l.remove(0) {
        Ok(node) => {
            if *node.get_val() != 3 || l.as_vec() != vec![2, 1] {
                println!("Test 1 FAILED: [3, 2, 1].remove(0)");
                println!("\t{:<16}3", "Expected value:");
                println!("\t{:<16}{}", "Got value:", node.get_val());
                println!("\t{:<16}[2, 1]", "Expected list:");
                println!("\t{:<16}{:?}", "Got list:", l.as_vec());
                all_passed = false;
            }
        }
        Err(e) => {
            println!("Test 1 FAILED: [3, 2, 1].remove(0)");
            println!("\t{:<16}3", "Expected value:");
            println!("\t{:<16}[2, 1]", "Expected list:");
            println!("\t{:<16}{:?}", "Got error:", e);
            all_passed = false;
        }
    }

    let mut l = LinkedList::from_slice(&[2, 1]);
    match l.remove(0) {
        Ok(node) => {
            if *node.get_val() != 2 || l.as_vec() != vec![1] {
                println!("Test 2 FAILED: [2, 1].remove(0)");
                println!("\t{:<16}2", "Expected value:");
                println!("\t{:<16}{}", "Got value:", node.get_val());
                println!("\t{:<16}[1]", "Expected list:");
                println!("\t{:<16}{:?}", "Got list:", l.as_vec());
                all_passed = false;
            }
        }
        Err(e) => {
            println!("Test 2 FAILED: [2, 1].remove(0)");
            println!("\t{:<16}2", "Expected value:");
            println!("\t{:<16}[1]", "Expected list:");
            println!("\t{:<16}{:?}", "Got error:", e);
            all_passed = false;
        }
    }

    let mut l = LinkedList::from_slice(&[1]);
    match l.remove(0) {
        Ok(node) => {
            if *node.get_val() != 1 || l.as_vec() != vec![] {
                println!("Test 3 FAILED: [1].remove(0)");
                println!("\t{:<16}1", "Expected value:");
                println!("\t{:<16}{}", "Got value:", node.get_val());
                println!("\t{:<16}[]", "Expected list:");
                println!("\t{:<16}{:?}", "Got list:", l.as_vec());
                all_passed = false;
            }
        }
        Err(e) => {
            println!("Test 2 FAILED: [1].remove(0)");
            println!("\t{:<16}1", "Expected value:");
            println!("\t{:<16}[]", "Expected list:");
            println!("\t{:<16}{:?}", "Got error:", e);
            all_passed = false;
        }
    }

    println!("Finished");
    if all_passed {
        "insert_empty_list_tests: PASSED"
    } else {
        "insert_empty_list_tests: FAILED"
    }
}



fn remove_tail_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING remove_tail_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::from_slice(&[1, 2, 3]);

    match l.remove(2) {
        Ok(node) => {
            if *node.get_val() != 3 || l.as_vec() != vec![1, 2] {
                println!("Test 1 FAILED: [1, 2, 3].remove(2)");
                println!("\t{:<16}3", "Expected value:");
                println!("\t{:<16}{}", "Got value:", node.get_val());
                println!("\t{:<16}[1, 2]", "Expected list:");
                println!("\t{:<16}{:?}", "Got list:", l.as_vec());
                all_passed = false;
            }
        }
        Err(e) => {
            println!("Test 1 FAILED: [1, 2, 3].remove(2)");
            println!("\t{:<16}3", "Expected value:");
            println!("\t{:<16}[1, 2]", "Expected list:");
            println!("\t{:<16}{:?}", "Got error:", e);
            all_passed = false;
        }
    }

    let mut l = LinkedList::from_slice(&[1, 2]);
    match l.remove(1) {
        Ok(node) => {
            if *node.get_val() != 2 || l.as_vec() != vec![1] {
                println!("Test 2 FAILED: [1, 2].remove(1)");
                println!("\t{:<16}2", "Expected value:");
                println!("\t{:<16}{}", "Got value:", node.get_val());
                println!("\t{:<16}[1]", "Expected list:");
                println!("\t{:<16}{:?}", "Got list:", l.as_vec());
                all_passed = false;
            }
        }
        Err(e) => {
            println!("Test 2 FAILED: [1, 2].remove(1)");
            println!("\t{:<16}2", "Expected value:");
            println!("\t{:<16}[1]", "Expected list:");
            println!("\t{:<16}{:?}", "Got error:", e);
            all_passed = false;
        }
    }

    let mut l = LinkedList::from_slice(&[1]);
    match l.remove(0) {
        Ok(node) => {
            if *node.get_val() != 1 || l.as_vec() != vec![] {
                println!("Test 3 FAILED: [1].remove(0)");
                println!("\t{:<16}1", "Expected value:");
                println!("\t{:<16}{}", "Got value:", node.get_val());
                println!("\t{:<16}[]", "Expected list:");
                println!("\t{:<16}{:?}", "Got list:", l.as_vec());
                all_passed = false;
            }
        }
        Err(e) => {
            println!("Test 3 FAILED: [1].remove(0)");
            println!("\t{:<16}1", "Expected value:");
            println!("\t{:<16}[]", "Expected list:");
            println!("\t{:<16}{:?}", "Got error:", e);
            all_passed = false;
        }
    }

    println!("Finished");
    if all_passed {
        "remove_tail_tests: PASSED"
    } else {
        "remove_tail_tests: FAILED"
    }
}



fn remove_mid_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING remove_mid_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::from_slice(&[1, 2, 3, 4]);

    match l.remove(2) {
        Ok(node) => {
            if *node.get_val() != 3 || l.as_vec() != vec![1, 2, 4] {
                println!("Test 1 FAILED: [1, 2, 3, 4].remove(2)");
                println!("\t{:<16}3", "Expected value:");
                println!("\t{:<16}{}", "Got value:", node.get_val());
                println!("\t{:<16}[1, 2, 4]", "Expected list:");
                println!("\t{:<16}{:?}", "Got list:", l.as_vec());
                all_passed = false;
            }
        }
        Err(e) => {
            println!("Test 1 FAILED: [1, 2, 3, 4].remove(2)");
            println!("\t{:<16}3", "Expected value:");
            println!("\t{:<16}[1, 2, 4]", "Expected list:");
            println!("\t{:<16}{:?}", "Got error:", e);
            all_passed = false;
        }
    }

    let mut l = LinkedList::from_slice(&[1, 2, 4]);
    match l.remove(1) {
        Ok(node) => {
            if *node.get_val() != 2 || l.as_vec() != vec![1, 4] {
                println!("Test 2 FAILED: [1, 2, 4].remove(1)");
                println!("\t{:<16}2", "Expected value:");
                println!("\t{:<16}{}", "Got value:", node.get_val());
                println!("\t{:<16}[1, 4]", "Expected list:");
                println!("\t{:<16}{:?}", "Got list:", l.as_vec());
                all_passed = false;
            }
        }
        Err(e) => {
            println!("Test 2 FAILED: [1, 2, 4].remove(1)");
            println!("\t{:<16}2", "Expected value:");
            println!("\t{:<16}[1, 3]", "Expected list:");
            println!("\t{:<16}{:?}", "Got error:", e);
            all_passed = false;
        }
    }

    println!("Finished");
    if all_passed {
        "remove_mid_tests: PASSED"
    } else {
        "remove_mid_tests: FAILED"
    }
}



fn remove_out_of_bounds_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING remove_out_of_bounds_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::from_slice(&[1, 2, 3]);

    let r = l.remove(100);
    if r.is_ok() {
        println!("Test 1 FAILED: [1, 2, 3].remove(100)");
            println!("\tExpected error");
            println!("\t{:<16}{}", "Got value:", r.ok().unwrap().get_val());
        all_passed = false;
    }

    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let r = l.remove(3);
    if r.is_ok() {
        println!("Test 2 FAILED: [1, 2, 3].remove(3)");
        println!("\tExpected error");
        println!("\t{:<16}{}", "Got value:", r.ok().unwrap().get_val());
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "remove_out_of_bounds_tests: PASSED"
    } else {
        "remove_out_of_bounds_tests: FAILED"
    }
}
