/// Custom macro for printing test results
macro_rules! log_custom {
    // 3 arguments: test string, expected, actual
    ($msg:expr, $expected:expr, $actual:expr) => {
        println!("TEST FAILED: {}", $msg);
        println!("\t{:<16}{:?}","Expected:", $expected);
        println!("\t{:<16}{:?}", "Actual:", $actual);
    };

    // 5 arguments: test_string, expected value, actual value, expected list, result list
    ($msg:expr, $expected_val:expr, $actual_val:expr, $expected_list:expr, $actual_list:expr) => {
        println!("TEST FAILED: {}", $msg);
        println!("\t{:<16}{:?}","Expected val:", $expected_val);
        println!("\t{:<16}{:?}", "Actual val:", $actual_val);
        println!("\t{:<16}{:?}","Expected list:", $expected_list);
        println!("\t{:<16}{:?}", "Actual list:", $actual_list);
    };

    // fallback for invalid usage
    ($($arg:tt)*) => {
        compile_error!("log_custom! expects 2 (msg, Result), 3, or 5 arguments.");
    };
}



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
    let results = vec![
        remove_empty_list_tests(),
        remove_head_tests(),
        remove_tail_tests(),
        remove_mid_tests(),
        remove_out_of_bounds_tests()];

    println!();
    for result in results {
        println!("{result}");
    }
}


fn remove_empty_list_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING remove_empty_list_tests TESTS "));
    let mut all_passed = true;



    let mut l = LinkedList::new();
    let res = l.remove(0);
    if res.is_ok() {
        log_custom!("[].remove(0)", "Err", res);
        all_passed = false;
    }



    let mut l = LinkedList::new();
    let res = l.remove(1);
    if res.is_ok() {
        log_custom!("[].remove(1)", "Err", res);
        all_passed = false;
    }



    let mut l = LinkedList::new();
    let res = l.remove(20);
    if res.is_ok() {
        log_custom!("[].remove(20)", "Err", res);
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
    println!("\n{}", format!("{:-^100}", " RUNNING remove_head_tests TESTS "));
    let mut all_passed = true;



    let mut l = LinkedList::from_slice(&[3, 2, 1]);
    let res = l.remove(0);
    let expected_val = 3;
    let expected_list = vec![2, 1];
    if let Ok(node) = res {
        if *node.get_val() != expected_val || l.as_vec() != expected_list {
            log_custom!("[3, 2, 1].remove(0)", expected_val, node.get_val(), expected_list, l.as_vec());
            all_passed = false;
        }
    } else {
        log_custom!("[3, 2, 1].remove(0)", expected_val, res);
    }



    let mut l = LinkedList::from_slice(&[2, 1]);
    let res = l.remove(0);
    let expected_val = 2;
    let expected_list = vec![1];
    if let Ok(node) = res {
        if *node.get_val() != expected_val || l.as_vec() != expected_list {
            log_custom!("[2, 1].remove(0)", expected_val, node.get_val(), expected_list, l.as_vec());
            all_passed = false;
        }
    } else {
        log_custom!("[2, 1].remove(0)", expected_val, res);
    }
    


    let mut l = LinkedList::from_slice(&[1]);
    let res = l.remove(0);
    let expected_val = 1;
    let expected_list = vec![];
    if let Ok(node) = res {
        if *node.get_val() != expected_val || l.as_vec() != expected_list {
            log_custom!("[1].remove(0)", expected_val, node.get_val(), expected_list, l.as_vec());
            all_passed = false;
        }
    } else {
        log_custom!("[1].remove(0)", expected_val, res);
    }



    println!("Finished");
    if all_passed {
        "insert_empty_list_tests: PASSED"
    } else {
        "insert_empty_list_tests: FAILED"
    }
}



fn remove_tail_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING remove_tail_tests TESTS "));
    let mut all_passed = true;



    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let res = l.remove(2);
    let expected_val = 3;
    let expected_list = vec![1, 2];
    if let Ok(node) = res {
        if *node.get_val() != expected_val || l.as_vec() != expected_list {
            log_custom!("[1, 2, 3].remove(2)", expected_val, node.get_val(), expected_list, l.as_vec());
            all_passed = false;
        }
    } else {
        log_custom!("[1, 2, 3].remove(2)", expected_val, res);
    }



    let mut l = LinkedList::from_slice(&[1, 2]);
    let res = l.remove(1);
    let expected_val = 2;
    let expected_list = vec![1];
    if let Ok(node) = res {
        if *node.get_val() != expected_val || l.as_vec() != expected_list {
            log_custom!("[1, 2].remove(1)", expected_val, node.get_val(), expected_list, l.as_vec());
            all_passed = false;
        }
    } else {
        log_custom!("[1, 2].remove(1)", expected_val, res);
    }



    let mut l = LinkedList::from_slice(&[1]);
    let res = l.remove(0);
    let expected_val = 1;
    let expected_list = vec![];
    if let Ok(node) = res {
        if *node.get_val() != expected_val || l.as_vec() != expected_list {
            log_custom!("[1].remove(0)", expected_val, node.get_val(), expected_list, l.as_vec());
            all_passed = false;
        }
    } else {
        log_custom!("[1].remove(0)", expected_val, res);
    }



    println!("Finished");
    if all_passed {
        "remove_tail_tests: PASSED"
    } else {
        "remove_tail_tests: FAILED"
    }
}



fn remove_mid_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING remove_mid_tests TESTS "));
    let mut all_passed = true;



    let mut l = LinkedList::from_slice(&[1, 2, 3, 4]);
    let res = l.remove(2);
    let expected_val = 3;
    let expected_list = vec![1, 2, 4];
    if let Ok(node) = res {
        if *node.get_val() != expected_val || l.as_vec() != expected_list {
            log_custom!("[1, 2, 3, 4].remove(2)", expected_val, node.get_val(), expected_list, l.as_vec());
            all_passed = false;
        }
    } else {
        log_custom!("[1, 2, 3, 4].remove(2)", expected_val, res);
    }



    let mut l = LinkedList::from_slice(&[1, 2, 4]);
    let res = l.remove(1);
    let expected_val = 2;
    let expected_list = vec![1, 4];
    if let Ok(node) = res {
        if *node.get_val() != expected_val || l.as_vec() != expected_list {
            log_custom!("[1, 2, 4].remove(1)", expected_val, node.get_val(), expected_list, l.as_vec());
            all_passed = false;
        }
    } else {
        log_custom!("[1, 2, 4].remove(1)", expected_val, res);
    }



    println!("Finished");
    if all_passed {
        "remove_mid_tests: PASSED"
    } else {
        "remove_mid_tests: FAILED"
    }
}



fn remove_out_of_bounds_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING remove_out_of_bounds_tests TESTS "));
    let mut all_passed = true;



    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let res = l.remove(100);
    if res.is_ok() {
        log_custom!("[1, 2, 3].remove(100)", "Err", res);
        all_passed = false;
    } else if l.as_vec() != vec![1, 2, 3] {
        log_custom!("[1, 2, 3].remove(100)", "[1, 2, 3]", l.as_vec());
        all_passed = false;
    }



    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let res = l.remove(3);
    if res.is_ok() {
        log_custom!("[1, 2, 3].remove(3)", "Err", res);
        all_passed = false;
    } else if l.as_vec() != vec![1, 2, 3] {
        log_custom!("[1, 2, 3].remove(3)", "[1, 2, 3]", l.as_vec());
        all_passed = false;
    }



    println!("Finished");
    if all_passed {
        "remove_out_of_bounds_tests: PASSED"
    } else {
        "remove_out_of_bounds_tests: FAILED"
    }
}
