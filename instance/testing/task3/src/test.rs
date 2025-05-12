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
        swap_empty_list_tests(),
        swap_head_tail_tests(),
        swap_mid_tests(),
        swap_head_mid_tests(),
        swap_mid_tail_tests(),
        swap_out_of_bounds_tests(),
        swap_same_index_tests()];

    println!();
    for result in results {
        println!("{result}");
    }
}



fn swap_empty_list_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING swap_empty_list_tests TESTS "));
    let mut all_passed = true;



    let mut l = LinkedList::new();
    let res = l.swap(0, 1);
    if res.is_ok() {
        log_custom!("[].swap(0, 1)", "Err", res);
        all_passed = false;
    } else if l.as_vec() != vec![] {
        log_custom!("[].swap(0, 1)", "[]", l.as_vec());
        all_passed = false;
    }



    let mut l = LinkedList::new();
    let res = l.swap(5, 1);
    if res.is_ok() {
        log_custom!("[].swap(5, 1)", "Err", res);
        all_passed = false;
    } else if l.as_vec() != vec![] {
        log_custom!("[].swap(5, 1)", "[]", l.as_vec());
        all_passed = false;
    }



    println!("Finished");
    if all_passed {
        "swap_empty_list_tests: PASSED"
    } else {
        "swap_empty_list_tests: FAILED"
    }
}




fn swap_head_tail_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING swap_head_tail_tests TESTS "));
    let mut all_passed = true;


    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let res = l.swap(0, 2);
    let expected_list = vec![3, 2, 1];
    if res.is_err() {
        log_custom!("[1, 2, 3].swap(0, 2)", "Ok", res);
    } else if l.as_vec() != expected_list {
        log_custom!("[1, 2, 3].swap(0, 2)", expected_list, l.as_vec());
        all_passed = false;
    }



    let mut l = LinkedList::from_slice(&[1, 2]);
    let res = l.swap(0, 1);
    let expected_list = vec![2, 1];
    if res.is_err() {
        log_custom!("[1, 2].swap(0, 1)", "Ok", res);
    } else if l.as_vec() != expected_list {
        log_custom!("[1, 2].swap(0, 1)", expected_list, l.as_vec());
        all_passed = false;
    }



    println!("Finished");
    if all_passed {
        "swap_head_tail_tests: PASSED"
    } else {
        "swap_head_tail_tests: FAILED"
    }
}



fn swap_mid_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING swap_mid_tests TESTS "));
    let mut all_passed = true;



    let mut l = LinkedList::from_slice(&[10, 20, 30, 40]);
    let res = l.swap(1, 2);
    let expected_list = vec![10, 30, 20, 40];
    if res.is_err() {
        log_custom!("[10, 20, 30, 40].swap(1, 2)", "Ok", res);
    } else if l.as_vec() != expected_list {
        log_custom!("[10, 20, 30, 40].swap(1, 2)", expected_list, l.as_vec());
        all_passed = false;
    }



    let mut l = LinkedList::from_slice(&[10, 20, 30, 40, 50]);
    let res = l.swap(1, 3);
    let expected_list = vec![10, 40, 30, 20, 50];
    if res.is_err() {
        log_custom!("[10, 20, 30, 40, 50].swap(1, 3)", "Ok", res);
    } else if l.as_vec() != expected_list {
        log_custom!("[10, 20, 30, 40, 50].swap(1, 3)", expected_list, l.as_vec());
        all_passed = false;
    }



    println!("Finished");
    if all_passed {
        "swap_mid_tests: PASSED"
    } else {
        "swap_mid_tests: FAILED"
    }
}


fn swap_head_mid_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING swap_head_mid_tests TESTS "));
    let mut all_passed = true;



    let mut l = LinkedList::from_slice(&[10, 20, 30, 40]);
    let res = l.swap(0, 2);
    let expected_list = vec![30, 20, 10, 40];
    if res.is_err() {
        log_custom!("[10, 20, 30, 40].swap(0, 2)", "Ok", res);
    } else if l.as_vec() != expected_list {
        log_custom!("[10, 20, 30, 40].swap(0, 2)", expected_list, l.as_vec());
        all_passed = false;
    }



    let mut l = LinkedList::from_slice(&[10, 20, 30, 40]);
    let res = l.swap(2, 0);
    let expected_list = vec![30, 20, 10, 40];
    if res.is_err() {
        log_custom!("[10, 20, 30, 40].swap(2, 0)", "Ok", res);
    } else if l.as_vec() != expected_list {
        log_custom!("[10, 20, 30, 40].swap(2, 0)", expected_list, l.as_vec());
        all_passed = false;
    }



    println!("Finished");
    if all_passed {
        "swap_head_mid_tests: PASSED"
    } else {
        "swap_head_mid_tests: FAILED"
    }
}



fn swap_mid_tail_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING swap_mid_tail_tests TESTS "));
    let mut all_passed = true;



    let mut l = LinkedList::from_slice(&[10, 20, 30, 40]);
    let res = l.swap(1, 3);
    let expected_list = vec![10, 40, 30, 20];
    if res.is_err() {
        log_custom!("[10, 20, 30, 40].swap(1, 3)", "Ok", res);
    } else if l.as_vec() != expected_list {
        log_custom!("[10, 20, 30, 40].swap(1, 3)", expected_list, l.as_vec());
        all_passed = false;
    }



    let mut l = LinkedList::from_slice(&[10, 20, 30, 40]);
    let res = l.swap(3, 1);
    let expected_list = vec![10, 40, 30, 20];
    if res.is_err() {
        log_custom!("[10, 20, 30, 40].swap(3, 1)", "Ok", res);
    } else if l.as_vec() != expected_list {
        log_custom!("[10, 20, 30, 40].swap(3, 1)", expected_list, l.as_vec());
        all_passed = false;
    }



    println!("Finished");
    if all_passed {
        "swap_mid_tail_tests: PASSED"
    } else {
        "swap_mid_tail_tests: FAILED"
    }
}




fn swap_out_of_bounds_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING swap_out_of_bounds_tests TESTS "));
    let mut all_passed = true;



    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let res = l.swap(0, 10);
    let expected_list = vec![1, 2, 3];
    if res.is_ok() {
        log_custom!("[1, 2, 3].swap(0, 10)", "Err", res);
    } else if l.as_vec() != expected_list {
        log_custom!("[1, 2, 3].swap(0, 10)", expected_list, l.as_vec());
        all_passed = false;
    }



    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let res = l.swap(3, 1);
    let expected_list = vec![1, 2, 3];
    if res.is_ok() {
        log_custom!("[1, 2, 3].swap(3, 1)", "Err", res);
    } else if l.as_vec() != expected_list {
        log_custom!("[1, 2, 3].swap(3, 1)", expected_list, l.as_vec());
        all_passed = false;
    }



    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let res = l.swap(10, 20);
    let expected_list = vec![1, 2, 3];
    if res.is_ok() {
        log_custom!("[1, 2, 3].swap(10, 20)", "Err", res);
    } else if l.as_vec() != expected_list {
        log_custom!("[1, 2, 3].swap(3, 1)", expected_list, l.as_vec());
        all_passed = false;
    }



    println!("Finished");
    if all_passed {
        "swap_out_of_bounds_tests: PASSED"
    } else {
        "swap_out_of_bounds_tests: FAILED"
    }
}



fn swap_same_index_tests() -> &'static str {
    println!("\n{}", format!("{:-^100}", " RUNNING swap_same_index_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let res = l.swap(1, 1);
    let expected_list = vec![1, 2, 3];
    if res.is_err() {
        log_custom!("[1, 2, 3].swap(1, 1)", "Ok", res);
        all_passed = false;
    } else if l.as_vec() != expected_list {
        log_custom!("[1, 2, 3].sawp(1, 1)", expected_list, l.as_vec());
    }


    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let res = l.swap(0, 0);
    let expected_list = vec![1, 2, 3];
    if res.is_err() {
        log_custom!("[1, 2, 3].swap(0, 0)", "Ok", res);
        all_passed = false;
    } else if l.as_vec() != expected_list {
        log_custom!("[1, 2, 3].sawp(0, 0)", expected_list, l.as_vec());
    }

    println!("Finished");
    if all_passed {
        "swap_same_index_tests: PASSED"
    } else {
        "swap_same_index_tests: FAILED"
    }
}

